/**
 * Enter here the user flows and custom policies for your B2C application
 * To learn more about user flows, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview
 * To learn more about custom policies, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview
 */
export const b2cPolicies = {
    names: {
        signUpSignIn: "B2C_1_susi"
    },
    authorities: {
        signUpSignIn: {
            authority: "https://petplaceb2c.b2clogin.com/petplaceb2c.onmicrosoft.com/b2c_1_susi",
        },
        changePassword: {
            authority: "https://petplaceb2c.b2clogin.com/petplaceb2c.onmicrosoft.com/B2C_1A_PASSWORDCHANGE"
        }
    },
    authorityDomain: "https://petplaceb2c.b2clogin.com"
}
