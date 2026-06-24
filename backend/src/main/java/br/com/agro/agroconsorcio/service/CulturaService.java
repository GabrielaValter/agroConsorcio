package br.com.agro.agroconsorcio.service;

import br.com.agro.agroconsorcio.dto.CulturaCadastroDTO;
import br.com.agro.agroconsorcio.model.Cultura;
import br.com.agro.agroconsorcio.model.TipoCultura;
import br.com.agro.agroconsorcio.repository.CulturaRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CulturaService {
    private final CulturaRepository culturaRepository;

    public CulturaService(CulturaRepository culturaRepository) {
        this.culturaRepository = culturaRepository;
    }

    // cadastrar uma nova cultura
    @Transactional
    public Cultura cadastrar(CulturaCadastroDTO dto) {

        String nomeFormatado = dto.nomeCultura().trim().toUpperCase();
        if (culturaRepository.existsByNomeCultura(nomeFormatado)) {
            throw new RuntimeException("Já existe uma cultura com esse nome");
        }

        Cultura cultura = new Cultura();

        cultura.setNomeCultura(nomeFormatado); // salvar com letras maiúsculas
        cultura.setTipoCultura(dto.tipoCultura());
        cultura.setFamilia(dto.familia());
        cultura.setTempoEstimado(dto.tempoEstimado());
        cultura.setEspacoPlantas(dto.espacoPlantas());
        cultura.setEspacoLinhas(dto.espacoLinhas());
        cultura.setSementeCova(dto.sementeCova());
        cultura.setDemandaNutricional(dto.demandaNutricional());
        cultura.setObservacaoCultura(dto.observacaoCultura());
        cultura.setArquivoFoto(dto.arquivoFoto());
        cultura.setRegiaoPlantio(dto.regiaoPlantio());
        cultura.setMesInicioNorte(dto.mesInicioNorte());
        cultura.setMesFimNorte(dto.mesFimNorte());
        cultura.setMesInicioNordeste(dto.mesInicioNordeste());
        cultura.setMesFimNordeste(dto.mesFimNordeste());
        cultura.setMesInicioCentroOeste(dto.mesInicioCentroOeste());
        cultura.setMesFimCentroOeste(dto.mesFimCentroOeste());
        cultura.setMesInicioSudeste(dto.mesInicioSudeste());
        cultura.setMesFimSudeste(dto.mesFimSudeste());
        cultura.setMesInicioSul(dto.mesInicioSul());
        cultura.setMesFimSul(dto.mesFimSul());

        return culturaRepository.save(cultura);
    }

    // listar todas as culturas
    public List<Cultura> listarTodas() {
        return culturaRepository.findAllByOrderByNomeCulturaAsc();
    }

    // buscar por id
    public Cultura buscarPorId(Long id) {
        return culturaRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Cultura não encontrada"));
    }

    // buscar por nome
    public List<Cultura> buscarPorNome(String nome) {
        return culturaRepository.findByNomeCulturaContainingIgnoreCaseOrderByNomeCulturaAsc(nome.trim());
    }

    // buscar por tipo
    public List<Cultura> buscarPorTipo(TipoCultura tipoCultura) {
        return culturaRepository.findByTipoCulturaOrderByNomeCulturaAsc(tipoCultura);
    }

    // buscar por região
//    public List<Cultura> buscarPorRegiao(RegiaoPlantio regiaoPlantio) {
//        return culturaRepository.findByRegiaoPlantio(regiaoPlantio);
//    }

    // editar cultura
    @Transactional
    public Cultura editarCultura(Long id, CulturaCadastroDTO dto) {
        Cultura cultura = buscarPorId(id);

        String nomeFormatado = dto.nomeCultura().trim().toUpperCase();
        if (!cultura.getNomeCultura().equalsIgnoreCase(nomeFormatado)) {
            if (culturaRepository.existsByNomeCulturaAndIdCulturaNot(nomeFormatado, id)) {
                throw new RuntimeException("Já existe uma cultura com esse nome");
            }
        }

        cultura.setNomeCultura(nomeFormatado); // salvar com letras maiúsculas
        cultura.setTipoCultura(dto.tipoCultura());
        cultura.setFamilia(dto.familia());
        cultura.setTempoEstimado(dto.tempoEstimado());
        cultura.setEspacoPlantas(dto.espacoPlantas());
        cultura.setEspacoLinhas(dto.espacoLinhas());
        cultura.setSementeCova(dto.sementeCova());
        cultura.setDemandaNutricional(dto.demandaNutricional());
        cultura.setObservacaoCultura(dto.observacaoCultura());
        cultura.setArquivoFoto(dto.arquivoFoto());
        cultura.setRegiaoPlantio(dto.regiaoPlantio());

        cultura.setMesInicioNorte(dto.mesInicioNorte());
        cultura.setMesFimNorte(dto.mesFimNorte());
        cultura.setMesInicioNordeste(dto.mesInicioNordeste());
        cultura.setMesFimNordeste(dto.mesFimNordeste());
        cultura.setMesInicioCentroOeste(dto.mesInicioCentroOeste());
        cultura.setMesFimCentroOeste(dto.mesFimCentroOeste());
        cultura.setMesInicioSudeste(dto.mesInicioSudeste());
        cultura.setMesFimSudeste(dto.mesFimSudeste());
        cultura.setMesInicioSul(dto.mesInicioSul());
        cultura.setMesFimSul(dto.mesFimSul());

        return culturaRepository.save(cultura);
    }

    // retornar erro se o nome já existir cadastrado no banco
    public boolean nomeJaExiste(String nomeCultura, Long id) {
        String nomeFromatado = nomeCultura.trim().toUpperCase();

        if (id == null) {
            return culturaRepository.existsByNomeCultura(nomeFromatado);
        }
        return culturaRepository.existsByNomeCulturaAndIdCulturaNot(nomeFromatado, id);
    }

    // excluir uma cultura
    public void excluir(Long id) {
        Cultura cultura = buscarPorId(id);
        culturaRepository.delete(cultura);
    }
}
