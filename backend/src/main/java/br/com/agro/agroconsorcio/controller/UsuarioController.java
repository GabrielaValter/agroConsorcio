package br.com.agro.agroconsorcio.controller;

import br.com.agro.agroconsorcio.dto.UsuarioCadastroDTO;
import br.com.agro.agroconsorcio.dto.UsuarioEdicaoDTO;
import br.com.agro.agroconsorcio.model.Usuario;
import br.com.agro.agroconsorcio.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {
    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody UsuarioCadastroDTO dto) {
        Usuario usuario = usuarioService.cadastrar(dto);

        return ResponseEntity.ok(Map.of(
                "idUsuario", usuario.getIdUsuario(),
                "nomeUsuario", usuario.getNomeUsuario(),
                "email", usuario.getEmail(),
                "telefone", usuario.getTelefone(),
                "tipoUsuario", usuario.getTipoUsuario()
        ));
    }

    // editar próprio usuário
    @PutMapping("/{id}")
    public ResponseEntity<?> editar(@PathVariable Long id,
                                          @RequestBody UsuarioEdicaoDTO dto) {
        Usuario usuario = usuarioService.editar(id, dto);

        return ResponseEntity.ok(Map.of(
                "idUsuario", usuario.getIdUsuario(),
                "nomeUsuario", usuario.getNomeUsuario(),
                "email", usuario.getEmail(),
                "telefone", usuario.getTelefone(),
                "tipoUsuario", usuario.getTipoUsuario()
        ));
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> listar() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Usuario>> buscar(@RequestParam String nome) {
        return ResponseEntity.ok(usuarioService.buscarColaboradores(nome));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        usuarioService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
