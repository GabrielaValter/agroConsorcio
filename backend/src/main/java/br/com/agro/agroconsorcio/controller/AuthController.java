package br.com.agro.agroconsorcio.controller;

import br.com.agro.agroconsorcio.dto.UsuarioLoginDTO;
import br.com.agro.agroconsorcio.infra.security.JwtUtil;
import br.com.agro.agroconsorcio.model.Usuario;
import br.com.agro.agroconsorcio.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final UsuarioService usuarioService;
    private final JwtUtil jwtUtil;

    public AuthController(UsuarioService usuarioService, JwtUtil jwtUtil) {
        this.usuarioService = usuarioService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UsuarioLoginDTO dto) {
        Usuario usuario = usuarioService.login(dto);
        String token = jwtUtil.gerarToken(usuario.getEmail());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "usuario", Map.of(
                        "idUsuario", usuario.getIdUsuario(),
                        "nomeUsuario", usuario.getNomeUsuario(),
                        "email", usuario.getEmail(),
                        "telefone", usuario.getTelefone(),
                        "tipoUsuario", usuario.getTipoUsuario()
                )
        ));
    }
}
