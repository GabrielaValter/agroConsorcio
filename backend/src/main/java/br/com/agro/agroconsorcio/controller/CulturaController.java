package br.com.agro.agroconsorcio.controller;

import br.com.agro.agroconsorcio.dto.CulturaCadastroDTO;
import br.com.agro.agroconsorcio.model.Cultura;
import br.com.agro.agroconsorcio.model.TipoCultura;
import br.com.agro.agroconsorcio.service.CulturaService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cultura")
public class CulturaController {
    private final CulturaService culturaService;

    public CulturaController(CulturaService culturaService) {
        this.culturaService = culturaService;
    }

    @PostMapping
    @Operation(summary = "Cadastrar uma nova cultura")
    public ResponseEntity<Cultura> cadastrar(@Valid @RequestBody CulturaCadastroDTO dto) {
        Cultura novaCultura = culturaService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaCultura);
    }

    @GetMapping
    @Operation(summary = "Listar todas as culturas")
    public ResponseEntity<List<Cultura>> listarTodas() {
        return ResponseEntity.ok(culturaService.listarTodas());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar cultura por ID")
    public ResponseEntity<Cultura> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(culturaService.buscarPorId(id));
    }

    @GetMapping("/buscar")
    @Operation(summary = "Buscar cultura por nome")
    public ResponseEntity<List<Cultura>> buscarPorNome(@RequestParam String nome) {
        return ResponseEntity.ok(culturaService.buscarPorNome(nome));
    }

    @GetMapping("/tipo/{tipo}")
    @Operation(summary = "Filtrar culturas por tipo")
    public ResponseEntity<List<Cultura>> buscarPorTipo(@PathVariable TipoCultura tipo) {
        return ResponseEntity.ok(culturaService.buscarPorTipo(tipo));
    }

//    @GetMapping("/regiao/{regiao}")
//    @Operation(summary = "Filtrar culturas por região")
//    public ResponseEntity<List<Cultura>> buscarPorRegiao(@PathVariable RegiaoPlantio regiao) {
//        return ResponseEntity.ok(culturaService.buscarPorRegiao(regiao));
//    }

    @GetMapping("/verificar-nome")
    public ResponseEntity<Boolean> verificarNome(
            @RequestParam String nome,
            @RequestParam(required = false) Long id
    ) {
        return ResponseEntity.ok(culturaService.nomeJaExiste(nome, id));
    }

    // editar cultura
    @PutMapping("/{id}")
    @Operation(summary = "Editar cultura")
    public ResponseEntity<Cultura> editar(@PathVariable Long id, @Valid @RequestBody CulturaCadastroDTO dto
    ) {
        Cultura culturaAtualizada = culturaService.editarCultura(id, dto);
        return ResponseEntity.ok(culturaAtualizada);
    }

    // excluir cultura
    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir cultura")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        culturaService.excluir(id);
        return ResponseEntity.noContent().build();
    }


}
