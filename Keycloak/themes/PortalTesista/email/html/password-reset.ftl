<#import "template.ftl" as layout>

<@layout.emailLayout>
  ${kcSanitize(msg(
    "passwordResetBodyHtml",
    realmName,
    link,
    linkExpirationFormatter(linkExpiration)
  ))?no_esc}

  <#if resetLink??>
    <p>${msg("passwordResetLink")}: <a href="${resetLink}">${resetLink}</a></p>
  <#else>
    <p>${msg("passwordResetNoLink")}</p>
  </#if>
</@layout.emailLayout>
