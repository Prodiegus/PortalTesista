<#ftl output_format="plainText">
${msg(
  "passwordResetBody",
  link,
  linkExpiration,
  realmName,
  linkExpirationFormatter(linkExpiration)
)}

<#if resetLink??>
${msg("passwordResetLink")}: ${resetLink}
<#else>
${msg("passwordResetNoLink")}
</#if>

<#if loginUrl??>
${msg("passwordResetLoginLink")}: ${loginUrl}
</#if>

