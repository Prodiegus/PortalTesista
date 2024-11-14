package PortalTesista.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class Controller {

    @GetMapping("/")
    public String suludo() {
        return "Portal Tesista API loggin";
    }

    @GetMapping("/hola-cargo")
    public String holaCargo() {
        return "Hola profesor a Cargo";
    }

    @GetMapping("/hola-guia")
    public String holaGuia() {
        return "Hola progesor Guia";
    }

    @GetMapping("/hola-alumno")
    public String holaTesista() {
        return "Hola alumno Tesista";
    }
}