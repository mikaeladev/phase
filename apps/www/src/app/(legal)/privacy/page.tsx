export default function PrivacyPage() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p>
        This privacy policy applies to the website(s) <code>phasebot.xyz</code>{" "}
        and all its associated subdomains, and our <code>discord.com</code> bot
        application <code>Phase#1862</code>. Uses of “we”, “us”, and “our” in
        this document refer to this online service.
      </p>

      <h2 id="data-storage-and-retention">Data Storage and Retention</h2>
      <p>
        Our database is used to store a variety of information to enhance the
        user experience. Examples of this include:
      </p>
      <ol>
        <li>
          <strong>Server Configuration Data</strong>
          <p>
            When you add the bot to a server, we store the ID of that server and
            its owner to a document in our database so it can be configured on
            the dashboard.
          </p>
        </li>
        <li>
          <strong>Additional Module Data</strong>
          <p>
            Some modules require additional data to work properly. For instance,
            when enabled in a server, the Levels module records level
            progression data for each user talking in the server.
          </p>
        </li>
        <li>
          <strong>Temporary Authentication Data</strong>
          <p>
            The <code>/bot login</code> command saves an authentication code to
            the database that is used to verify your identity on the dashboard.
            This code can only be used once and only remains valid for 1 minute.
          </p>
        </li>
      </ol>
      <p>
        Data is only kept for as long as it is necessary. If the bot is removed
        from a server, all data relating to that server is swiftly deleted.
      </p>

      <h2 id="data-security">Data Security</h2>
      <p>
        We take every reasonable precaution to protect your data from
        unauthorised access and employ a number of security measures to
        safeguard it. However, absolute data security cannot be guaranteed and,
        despite any of our best efforts, there will always be a risk of data
        breaches. In such an event, we will comply with all applicable laws and
        procedures to protect your data and mitigate any potential harm.
      </p>
      <p>
        Access to highly sensitive data, such as bot tokens or database
        credentials, is strictly limited to the bot owner. Our goal is to
        provide you with a secure and trustworthy service that respects your
        privacy and protects your information.
      </p>

      <h2 id="data-request-procedures">Data Request Procedures</h2>
      <p>
        If you wish to have all of your data stored by us deleted or viewed,
        please make a{" "}
        <a href="https://phasebot.xyz/redirect/discord">support ticket</a>. We
        will take all necessary steps to ensure that your request is processed
        in a timely and efficient manner, and we will notify you in the ticket
        once your data has been deleted or is ready for viewing.
      </p>

      <h2 id="updates-and-changes">Updates and Changes</h2>
      <p>
        We have the discretion to change this policy to reflect updates to our
        processes, current acceptable practices, or legal or regulatory changes.
        If we decide to change this policy, we will post the changes here at the
        same link you are currently using to read this policy. We reserve the
        right to update this policy at any time without notice.
      </p>
      <p>
        It is important to note that we have no control over the privacy
        policies of any external services that may be linked on our website. We
        are not affiliated with any of the services linked on our website and
        cannot be held responsible for their privacy practices.
      </p>

      <h2 id="last-updated">Last Updated</h2>
      <p>5th of February, 2025</p>
    </>
  )
}
