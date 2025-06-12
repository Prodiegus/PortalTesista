<#ftl output_format="plainText">
${msg(
  "passwordResetBody",
  realmName,
  link,
  linkExpirationFormatter(linkExpiration)
)}

<#if resetLink??>
${msg("passwordResetLink")}: ${resetLink}
<#else>
${msg("passwordResetNoLink")}
</#if>
