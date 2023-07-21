export default async function decorate(block) {
  block.querySelector('div').classList.add('range');

  const expenses = document.createElement('div');
  expenses.classList.add('expenses');
  expenses.innerText = 'Average Range of Expenses:';
  block.append(expenses);
}
