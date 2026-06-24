package br.com.agro.agroconsorcio.dto;

import br.com.agro.agroconsorcio.model.RegiaoPlantio;
import br.com.agro.agroconsorcio.model.TipoCultura;
import jakarta.validation.constraints.*;

public record CulturaCadastroDTO(
        @NotBlank(message = "O nome da cultura é obrigatório")
        @Size(max = 100, message = "O nome da cultura deve ter no máximo 100 caracteres")
        String nomeCultura,

        @NotNull(message = "O tipo da cultura é obrigatório")
        TipoCultura tipoCultura,

        @Size(max = 50, message = "A família deve ter no máximo 50 caracteres")
        String familia,

        @Positive(message = "O tempo estimado deve ser positivo")
        Integer tempoEstimado,

        @Positive(message = "O espaço entre plantas deve ser positivo")
        Integer espacoPlantas,

        @Positive(message = "O espaço entre linhas deve ser positivo")
        Integer espacoLinhas,

        @Positive(message = "A quantidade de sementes por cova deve ser positiva")
        Integer sementeCova,

        String demandaNutricional,

        String observacaoCultura,

        @NotBlank(message = "A foto da cultura é obrigatória")
        String arquivoFoto,
        
        RegiaoPlantio regiaoPlantio,

        // NORTE
        @Min(1)
        @Max(12)
        Integer mesInicioNorte,

        @Min(1)
        @Max(12)
        Integer mesFimNorte,

        // NORDESTE
        @Min(1)
        @Max(12)
        Integer mesInicioNordeste,

        @Min(1)
        @Max(12)
        Integer mesFimNordeste,

        // CENTRO-OESTE
        @Min(1)
        @Max(12)
        Integer mesInicioCentroOeste,

        @Min(1)
        @Max(12)
        Integer mesFimCentroOeste,

        // SUDESTE
        @Min(1)
        @Max(12)
        Integer mesInicioSudeste,

        @Min(1)
        @Max(12)
        Integer mesFimSudeste,

        // SUL
        @Min(1)
        @Max(12)
        Integer mesInicioSul,

        @Min(1)
        @Max(12)
        Integer mesFimSul
){
}
