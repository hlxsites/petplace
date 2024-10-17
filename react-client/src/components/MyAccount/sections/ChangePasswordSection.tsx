import { ChangePassword } from "../ChangePassword";

export const ChangePasswordSection = () => {
  return <ChangePassword onChangePassword={triggerChangePassword}/>;

  function triggerChangePassword () {
    const passwordChangeButton = document.getElementById('react-password-change');

    if (passwordChangeButton) {
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      });

      passwordChangeButton.dispatchEvent(event);
    }
  };
};
