package PortalTesista.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class Controller {

    @GetMapping("/")
    public String saludo() {
        return "Portal Tesista API loggin";
    }

    @GetMapping("/hola-cargo")
    @PreAuthorize("hasRole('cargo')")
    public String holaCargo() {
        return "Hola profesor a Cargo";
    }

    @GetMapping("/hola-guia")
    @PreAuthorize("hasRole('guia')")
    public String holaGuia() {
        return "Hola profesor Guia";
    }

    @GetMapping("/hola-alumno")
    @PreAuthorize("hasRole('alumno')")
    public String holaTesista() {
        return "Hola alumno Tesista";
    }
}