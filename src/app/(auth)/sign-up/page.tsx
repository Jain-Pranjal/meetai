import React from 'react'
import SignupView from '@/modules/auth/ui/SignupView'
function SignUp() {
  return (
    <div>
      <SignupView />
    </div>
  )
}

export default SignUp

// here we are rendering the main view of the signup page as a server component and in that wee are rendering the SignupView component which is a client component