package br.com.agro.agroconsorcio.dto;

import br.com.agro.agroconsorcio.model.TipoRelacao;
import jakarta.validation.constraints.*;
import java.util.List;

public record RelacaoCulturaCadastroDTO(

        @NotNull(message = "O tipo da relação é obrigatório")
        TipoRelacao tipoRelacao,

        @NotBlank(message = "A justificativa é obrigatória")
        String justificativa,

        String linkReferencia,

        @Min(value = 1900, message = "O ano da referência deve ser válido")
        @Max(value = 2100, message = "O ano da referência deve ser válido")
        Integer anoReferencia,

        String observacaoConsorcio,

        @NotNull(message = "A lista de culturas é obrigatória")
        @Size(min = 2, max = 5, message = "A relação deve possuir entre 2 e 5 culturas")
        List<Long> idsCulturas
) {
}