import { MyAccountInfoTabs } from "../../../routes/account/components/MyAccountInfoTabs";

export const MyAccountInfoSection = () => {
  // This component should get info about user login and pass as prop to MyAccountInfoTabs
  return <MyAccountInfoTabs isExternalLogin />;
};
