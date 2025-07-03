<#import "template.ftl" as layout>

<@layout.emailLayout>
  ${kcSanitize(msg(
    "passwordResetBodyHtml",
    realmName,
    link,
    linkExpirationFormatter(linkExpiration)
  ))?no_esc}
