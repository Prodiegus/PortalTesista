<#-- email/html/password-reset.ftl -->
<#import "email-macros.ftl" as emailMacros>
<p><@emailMacros.msg "passwordResetBody" /></p>

<#if resetLink??>
    <p><@emailMacros.msg "passwordResetLink" />: <a href="${resetLink}">${resetLink}</a></p>
<#else>
    <p><@emailMacros.msg "passwordResetNoLink" /></p>
</#if>

<p><@emailMacros.msg "passwordResetLoginLink" />: <a href="${loginUrl}">${loginUrl}</a></p>
