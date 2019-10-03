const passwordResetSuccess = email => `The password has been reset for ${email}. Please sign into your account with your new password.`;

const passwordResetToken = email => ({
  message: `The password reset request has been accepted. Your request is being processed. Please check ${email} for a confirmation link to set up a new password.`,
});

const thanksForReg = (email, firstName, lastName) => ({
  message: `Thank you for registering, ${firstName} ${lastName}. Your account is currently being processed. Please check ${email} for a final confirmation email.`,
});

export { passwordResetSuccess, passwordResetToken, thanksForReg };
