import {
  type ConditionCriteria,
  type ConditionExpression,
  type ElementUnion,
  type FormSchema,
  type FormVariable,
  type FormVariableValues,
  type InputValue,
} from "../types/formTypes";

const VARIABLE_TEMPLATE_STRING_REGEX = /{{(.*?)\|.*?}}/;

export function replaceVariablesInSettings(
  schema: FormSchema,
  variables: FormVariableValues | undefined
): FormSchema {
  if (!variables) return schema;

  const replaceElementVariables = (childElement: ElementUnion) => {
    const clonedElement = { ...childElement };

    // The elements that has children doesn't have options, so we need to replace the variables in the children instead
    if ("children" in clonedElement) {
      clonedElement.children = clonedElement.children.map(
        replaceElementVariables
      );
    } else if (
      "options" in clonedElement &&
      clonedElement.optionsType === "dynamic" &&
      typeof clonedElement.options === "string" &&
      VARIABLE_TEMPLATE_STRING_REGEX.test(clonedElement.options)
    ) {
      const [variableName] = getVariableNameAndType(clonedElement.options);
      const value = getVariableValue(variableName, variables);
      // @ts-expect-error - We want to replace the variable here
      clonedElement.options = value;
    }

    // Replace variable in disabled condition value
    if ("disabledCondition" in clonedElement) {
      replaceConditionCriteriaVariables(
        clonedElement.disabledCondition,
        variables
      );
    }

    // Replace variable in required condition value
    if ("requiredCondition" in clonedElement) {
      replaceConditionCriteriaVariables(
        clonedElement.requiredCondition,
        variables
      );
    }

    // Replace variable in shouldDisplay condition value
    replaceConditionCriteriaVariables(clonedElement.shouldDisplay, variables);

    return clonedElement;
  };

  return {
    ...schema,
    children: schema.children.map(replaceElementVariables),
  };
}

function replaceCriteriaVariable(
  criteria: ConditionCriteria,
  variables: FormVariableValues
) {
  const isStillTemplateStringVariable =
    criteria.valueType === "dynamic" &&
    VARIABLE_TEMPLATE_STRING_REGEX.test(criteria.value);

  // If the value type is not dynamic, it means it's a static value
  if (!isStillTemplateStringVariable) return;

  const [variableName] = getVariableNameAndType(criteria.value);
  const value = getVariableValue(variableName, variables);
  // @ts-expect-error - We want to replace the variable here
  criteria.value = value;
}

function replaceConditionCriteriaVariables(
  condition: ConditionExpression | undefined,
  variables: FormVariableValues
) {
  // If the condition is a boolean or undefined, it means it's a static condition
  if (!condition || typeof condition === "boolean") return;

  if ("type" in condition) {
    replaceCriteriaVariable(condition, variables);
  } else if ("conditions" in condition) {
    condition.conditions.forEach((c) =>
      replaceConditionCriteriaVariables(c, variables)
    );
  }
}

function getVariableNameAndType(templateString: FormVariable) {
  // Assumes the format is {{variableName|dataType}}
  const [name, type] = templateString.split("|");
  const variableName = name?.replace("{{", "");
  const variableType = type?.replace("}}", "");
  return [variableName, variableType];
}

function getVariableValue(
  variableName: string,
  variables: FormVariableValues
): InputValue {
  if (!variables[variableName]) {
    throw new Error(`Variable ${variableName} not found`);
  }

  return variables[variableName];
}
