package br.com.agro.agroconsorcio.service;

import br.com.agro.agroconsorcio.dto.RelacaoCulturaCadastroDTO;
import br.com.agro.agroconsorcio.model.Cultura;
import br.com.agro.agroconsorcio.model.CulturaAssociada;
import br.com.agro.agroconsorcio.model.RelacaoCultura;
import br.com.agro.agroconsorcio.model.TipoRelacao;
import br.com.agro.agroconsorcio.repository.CulturaRepository;
import br.com.agro.agroconsorcio.repository.RelacaoCulturaRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RelacaoCulturaService {

    private final RelacaoCulturaRepository relacaoCulturaRepository;
    private final CulturaRepository culturaRepository;

    public RelacaoCulturaService(
            RelacaoCulturaRepository relacaoCulturaRepository,
            CulturaRepository culturaRepository
    ) {
        this.relacaoCulturaRepository = relacaoCulturaRepository;
        this.culturaRepository = culturaRepository;
    }

    // cadastrar uma nova relação entre culturas
    @Transactional
    public RelacaoCultura cadastrar(RelacaoCulturaCadastroDTO dto) {
        if (dto.idsCulturas().stream().distinct().count() != dto.idsCulturas().size()) {
            throw new RuntimeException("Não é permitido repetir culturas na mesma relação");
        }

        List<Long> idsOrdenados = dto.idsCulturas()
                .stream()
                .distinct()
                .sorted()
                .toList();

        if (idsOrdenados.size() < 2 || idsOrdenados.size() > 5) {
            throw new RuntimeException("A relação deve possuir entre 2 e 5 culturas diferentes");
        }

        String assinatura = gerarAssinatura(idsOrdenados);

        if (relacaoCulturaRepository.existsByAssinaturaCulturas(assinatura)) {
            throw new RuntimeException("Já existe uma relação cadastrada com essa combinação de culturas");
        }

        List<Cultura> culturas = culturaRepository.findAllById(idsOrdenados);

        if (culturas.size() != idsOrdenados.size()) {
            throw new RuntimeException("Uma ou mais culturas informadas não foram encontradas");
        }

        RelacaoCultura relacao = new RelacaoCultura();

        relacao.setTipoRelacao(dto.tipoRelacao());
        relacao.setJustificativa(dto.justificativa());
        relacao.setLinkReferencia(dto.linkReferencia());
        relacao.setAnoReferencia(dto.anoReferencia());
        relacao.setObservacaoConsorcio(dto.observacaoConsorcio());
        relacao.setAssinaturaCulturas(assinatura);

        for (Cultura cultura : culturas) {
            CulturaAssociada culturaAssociada = new CulturaAssociada();
            culturaAssociada.setRelacaoCultura(relacao);
            culturaAssociada.setCultura(cultura);

            relacao.getCulturasAssociadas().add(culturaAssociada);
        }
        return relacaoCulturaRepository.save(relacao);
    }

    // listar todas as relações
    public List<RelacaoCultura> listarTodas() {
        return relacaoCulturaRepository.findAllByOrderByAssinaturaCulturasAsc();
    }

    // buscar relação por id
    public RelacaoCultura buscarPorId(Long id) {
        return relacaoCulturaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Relação de culturas não encontrada"));
    }

    // buscar por tipo de relação
    public List<RelacaoCultura> buscarPorTipo(TipoRelacao tipoRelacao) {
        return relacaoCulturaRepository.findByTipoRelacaoOrderByAssinaturaCulturasAsc(tipoRelacao);
    }

    // editar relação de culturas
    @Transactional
    public RelacaoCultura editarRelacao(Long id, RelacaoCulturaCadastroDTO dto) {
        RelacaoCultura relacao = buscarPorId(id);

        if (dto.idsCulturas().stream().distinct().count() != dto.idsCulturas().size()) {
            throw new RuntimeException("Não é permitido repetir culturas na mesma relação");
        }

        List<Long> idsOrdenados = dto.idsCulturas()
                .stream()
                .distinct()
                .sorted()
                .toList();

        if (idsOrdenados.size() < 2 || idsOrdenados.size() > 5) {
            throw new RuntimeException("A relação deve possuir entre 2 e 5 culturas diferentes");
        }

        String assinatura = gerarAssinatura(idsOrdenados);

        if (relacaoCulturaRepository.existsByAssinaturaCulturasAndIdRelacaoNot(assinatura, id)) {
            throw new RuntimeException("Já existe uma relação cadastrada com essa combinação de culturas");
        }

        List<Cultura> culturas = culturaRepository.findAllById(idsOrdenados);

        if (culturas.size() != idsOrdenados.size()) {
            throw new RuntimeException("Uma ou mais culturas informadas não foram encontradas");
        }

        relacao.setTipoRelacao(dto.tipoRelacao());
        relacao.setJustificativa(dto.justificativa());
        relacao.setLinkReferencia(dto.linkReferencia());
        relacao.setAnoReferencia(dto.anoReferencia());
        relacao.setObservacaoConsorcio(dto.observacaoConsorcio());
        relacao.setAssinaturaCulturas(assinatura);

        relacao.getCulturasAssociadas().clear();

        for (Cultura cultura : culturas) {
            CulturaAssociada culturaAssociada = new CulturaAssociada();
            culturaAssociada.setRelacaoCultura(relacao);
            culturaAssociada.setCultura(cultura);

            relacao.getCulturasAssociadas().add(culturaAssociada);
        }
        return relacaoCulturaRepository.save(relacao);
    }

    // excluir relação de culturas
    public void excluir(Long id) {
        RelacaoCultura relacao = buscarPorId(id);
        relacaoCulturaRepository.delete(relacao);
    }

    // gera assinatura única da combinação de culturas
    private String gerarAssinatura(List<Long> idsCulturas) {
        return idsCulturas.stream()
                .map(String::valueOf)
                .collect(Collectors.joining("-"));
    }
}