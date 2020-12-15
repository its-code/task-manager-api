const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const sendWelcomeEmail = (email,name)=>{
  sgMail.send({
     to: email,
     from: 'razaasad270@gmail.com',
     subject: 'Welcome into the Mailroom :D',
     text: `Hello ${name} Sir, I hope you are doing fine, welcome to our Application`
  })
}

const sendFairwellEmail = (email,name)=>{
    sgMail.send({
       to: email,
       from: 'razaasad270@gmail.com',
       subject: 'We are Sad that you are leaving us :(',
       text: `Hello ${name} Sir, We are very sorry that you made this decision,please let us know if we can still help you somehow`
    })
  }

  module.exports = {
      sendWelcomeEmail,
      sendFairwellEmail
  }
  