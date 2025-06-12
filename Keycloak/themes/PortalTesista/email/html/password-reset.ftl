<#import "template.ftl" as layout>

<@layout.emailLayout>
  ${kcSanitize(msg(
    "passwordResetBodyHtml",
    link,
    linkExpiration,
    realmName,
    linkExpirationFormatter(linkExpiration)
  ))?no_esc}

  <#if resetLink??>
    <p>${msg("passwordResetLink")}: <a href="${resetLink}">${resetLink}</a></p>
  <#else>
    <p>${msg("passwordResetNoLink")}</p>
  </#if>

  <#-- loginUrl generalmente no está presente en el email -->
</@layout.emailLayout>
