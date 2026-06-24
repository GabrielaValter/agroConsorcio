package br.com.agro.agroconsorcio.controller;

import br.com.agro.agroconsorcio.dto.RelacaoCulturaCadastroDTO;
import br.com.agro.agroconsorcio.model.RelacaoCultura;
import br.com.agro.agroconsorcio.model.TipoRelacao;
import br.com.agro.agroconsorcio.service.RelacaoCulturaService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/relacoes-culturas")
public class RelacaoCulturaController {
    private final RelacaoCulturaService relacaoCulturaService;

    public RelacaoCulturaController(RelacaoCulturaService relacaoCulturaService) {
        this.relacaoCulturaService = relacaoCulturaService;
    }

    @PostMapping
    @Operation(summary = "Cadastrar uma nova relação entre culturas")
    public ResponseEntity<RelacaoCultura> cadastrar(@Valid @RequestBody RelacaoCulturaCadastroDTO dto) {
        RelacaoCultura novaRelacao = relacaoCulturaService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaRelacao);
    }

    @GetMapping
    @Operation(summary = "Listar todas as relações entre culturas")
    public ResponseEntity<List<RelacaoCultura>> listarTodas() {
        return ResponseEntity.ok(relacaoCulturaService.listarTodas());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar relação entre culturas por ID")
    public ResponseEntity<RelacaoCultura> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(relacaoCulturaService.buscarPorId(id));
    }

    @GetMapping("/tipo/{tipo}")
    @Operation(summary = "Filtrar relações por tipo")
    public ResponseEntity<List<RelacaoCultura>> buscarPorTipo(@PathVariable TipoRelacao tipo) {
        return ResponseEntity.ok(relacaoCulturaService.buscarPorTipo(tipo));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Editar relação entre culturas")
    public ResponseEntity<RelacaoCultura> editar(
            @PathVariable Long id,
            @Valid @RequestBody RelacaoCulturaCadastroDTO dto
    ) {
        RelacaoCultura relacaoAtualizada = relacaoCulturaService.editarRelacao(id, dto);
        return ResponseEntity.ok(relacaoAtualizada);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir relação entre culturas")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        relacaoCulturaService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}