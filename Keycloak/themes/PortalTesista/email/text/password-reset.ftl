<#import "template.ftl" as layout>
<#import "email-macros.ftl" as emailMacros>

<@layout.emailLayout>
  ${kcSanitize(msg(
    "passwordResetBodyHtml",
    link,
    linkExpiration,
    realmName,
    linkExpirationFormatter(linkExpiration)
  ))?no_esc}

  <#if resetLink??>
    <p><@emailMacros.msg "passwordResetLink" />: <a href="${resetLink}">${resetLink}</a></p>
  <#else>
    <p><@emailMacros.msg "passwordResetNoLink" /></p>
  </#if>

  <p><@emailMacros.msg "passwordResetLoginLink" />: <a href="${loginUrl}">${loginUrl}</a></p>
</@layout.emailLayout>
