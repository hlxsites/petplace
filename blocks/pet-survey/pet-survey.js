
/* eslint-disable indent */
import { fetchPlaceholders } from '../../scripts/lib-franklin.js';
import { isLoggedIn, acquireToken } from '../../scripts/lib/msal/msal-authentication.js';
import endPoints from '../../variables/endpoints.js';
import { createPresurvey, createSurveySteps, createSummary } from './survey-ui.js';


function hidePresurvey() {
    const preSurvey = document.querySelector('.pet-survey__layout-container--presurvey');
    if (preSurvey) {
        preSurvey.classList.add('hide');
    }
}
function showSurvey() {
    const survey = document.querySelector('.pet-survey__layout-container--survey');
    if (survey) {
        survey.classList.remove('hide');
    }
}
async function fetchSurveyQuestions(surveyId) {
    const questionsApi = `${endPoints.apiUrl}/adopt/api/SurveyQuestion/${surveyId}`;
    let result;
    try {
        const resp = await fetch(questionsApi);
        if (resp.ok) {
            result = await resp.json();
        }
    } catch (error) {
        console.error('Error:', error);
    }
    return result;
}
async function fetchSurveyResponse(surveyId, token) {
    const surveyApi = `${endPoints.apiUrl}/adopt/api/SurveyResponse/survey/${surveyId}`;
    const config = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };
    let result;
    try {
        const resp = await fetch(surveyApi, config);
        if (resp.ok) {
            result = await resp.json();
        }
    } catch (error) {
        console.error('Error:', error);
    }
    return result;
}
async function postSurveyAnswers(surveyId, token) {
  console.log(token);
    const surveyApi = `${endPoints.apiUrl}/adopt/api/SurveyResponse`;
    const payload = {
        SurveyId: 1,
        SurveyResponseAnswers: [
          {
            QuestionId: 1,
            QuestionOptionId: 1
          },
          {
            QuestionId: 2,
            QuestionOptionId: 4
          },
          {
            QuestionId: 3,
            QuestionOptionId: 10
          },
          {
            QuestionId: 4,
            QuestionOptionId: null,
            ExternalAnswerKey: "AFFENPINSCHER",
            UserResponseText: "Affenpinscher"
          },
          {
            QuestionId: 4,
            QuestionOptionId: null,
            ExternalAnswerKey: "AFGHAN HOUND",
            UserResponseText: "Afghan Hound"
          },
          {
            QuestionId: 7,
            QuestionOptionId: 13
          },
          {
            QuestionId: 8,
            QuestionOptionId: 18
          },
          {
            QuestionId: 9,
            QuestionOptionId: 23
          },
          {
            QuestionId: 10,
            QuestionOptionId: 26
          },
          {
            QuestionId: 11,
            QuestionOptionId: 29
          },
          {
            QuestionId: 12,
            QuestionOptionId: 30
          },
          {
            QuestionId: 13,
            QuestionOptionId: 36
          },
          {
            QuestionId: 14,
            UserResponseText: "5"
          },
          {
            QuestionId: 15,
            QuestionOptionId: 40
          },
          {
            QuestionId: 16,
            QuestionOptionId: 43
          },
          {
            QuestionId: 17,
            QuestionOptionId: 47
          }
        ]
      };
    const config = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    };
    let result;
    try {
        const resp = await fetch(surveyApi, config);
        console.log(resp)
        if (resp.ok) {
            result = await resp.json();
        }
    } catch (error) {
        console.error('Error:', error);
    }
    return result;

}
export default async function decorate(block) {
    block.textContent = '';
    const IS_LOGGED_IN = await isLoggedIn();
    const searchParams = new URLSearchParams(window.location.search);
    const animalType = searchParams.get('animalType');
    const animalId = searchParams.get('animalId');
    const clientId = searchParams.get('clientId');
    const surveyId = animalType === 'dog' ? 1 : animalType === 'cat' ? 2 : null;

    // fetch placeholders from the 'adopt' folder
    const placeholders = await fetchPlaceholders('/adopt');
    // retrieve the value for Pet Survey
    const {
        preSurveyHeading,
        preSurveySubheading,
        preSurveySignInLabel,
        surveyCancelLabel,createSurveySummary,
        surveyStartLabel,
        surveyHeading,
        surveySummaryHeading,
        surveySummarySubheading,
    } = placeholders;
    const questions = await fetchSurveyQuestions(surveyId);
    console.log(questions)
    const formHtml = createSummary(animalType, questions);
    block.append(formHtml)

    if (IS_LOGGED_IN) {
        const token = await acquireToken();
        const result = await fetchSurveyResponse(surveyId, token);
        //const postResult = await postSurveyAnswers(surveyId, token);
        if (result && result.Completed) {

        } else {

        }

    } else {
        block.append(createPresurvey(preSurveyHeading, preSurveySubheading, preSurveySignInLabel, surveyCancelLabel, surveyStartLabel));
        const questions = await fetchSurveyQuestions(surveyId);
        block.append(createSurveySteps(surveyHeading, questions));
    }

}