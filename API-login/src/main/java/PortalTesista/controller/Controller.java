package PortalTesista.controller;

import PortalTesista.controller.dto.RoleResponse;
import PortalTesista.controller.dto.SaludoResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Collection;

import static org.springframework.security.authorization.AuthorityReactiveAuthorizationManager.hasRole;

@RestController
public class Controller {

    @GetMapping("/")
    public SaludoResponse saludo() {
        return new SaludoResponse();
    }

    @GetMapping("/cargo")
    @PreAuthorize("hasRole('cargo')")
    public SaludoResponse holaCargo() {
        return new SaludoResponse("Hola profesor a Cargo");
    }

    @GetMapping("/guia")
    @PreAuthorize("hasRole('guia')")
    public SaludoResponse holaGuia() {
        return new SaludoResponse("Hola profesor Guia");
    }

    @GetMapping("/alumno")
    @PreAuthorize("hasRole('alumno')")
    public SaludoResponse holaTesista() {
        return new SaludoResponse("Hola alumno Tesista");
    }

    @GetMapping("/roles")
    public RoleResponse getRoles() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
            for (GrantedAuthority authority : authorities) {
                String role = authority.getAuthority();
                if (role.equals("ROLE_guia")) {
                    return new RoleResponse("guia");
                } else if (role.equals("ROLE_cargo")) {
                    return new RoleResponse("cargo");
                } else if (role.equals("ROLE_alumno")) {
                    return new RoleResponse("alumno");
                }
            }
        }
        return new RoleResponse("No role found");
    }
}