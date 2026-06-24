package br.com.agro.agroconsorcio.service;

import br.com.agro.agroconsorcio.dto.UsuarioEdicaoDTO;
import br.com.agro.agroconsorcio.dto.UsuarioLoginDTO;
import br.com.agro.agroconsorcio.dto.UsuarioCadastroDTO;
import br.com.agro.agroconsorcio.model.TipoUsuario;
import br.com.agro.agroconsorcio.model.Usuario;
import br.com.agro.agroconsorcio.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    // usuario logado
    private Usuario getUsuarioLogado() {
        Object principal = SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        if (!(principal instanceof Usuario usuario)) {
            throw new RuntimeException("Usuário não autenticado");
        }
        return usuario;
    }

    // verificar se é admin
    private void validarAdmin(Usuario usuario) {
        if (usuario.getTipoUsuario() != TipoUsuario.ADMINISTRADOR) {
            throw  new RuntimeException("Acesso negado");
        }
    }

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // criar um novo colaborador
    @Transactional
    public Usuario cadastrar(UsuarioCadastroDTO dtoCadastro) {
        Usuario usuarioLogado = getUsuarioLogado();
        validarAdmin(usuarioLogado);

        if (usuarioRepository.existsByEmail(dtoCadastro.email())) {
            throw new IllegalArgumentException("Email já cadastrado");
        }
        if (!dtoCadastro.senha().equals(dtoCadastro.confirmarSenha())) {
            throw new IllegalArgumentException("As senhas não conferem");
        }

        Usuario usuario = new Usuario();
        usuario.setNomeUsuario(dtoCadastro.nomeUsuario());
        usuario.setEmail(dtoCadastro.email());
        usuario.setTelefone(dtoCadastro.telefone());
        usuario.setSenha( passwordEncoder.encode(dtoCadastro.senha()));
        usuario.setTipoUsuario(TipoUsuario.COLABORADOR);

        return usuarioRepository.save(usuario);
    }

    // login de colaborador ou administrador
    public Usuario login(UsuarioLoginDTO dtoLogin) {
        Usuario usuario = usuarioRepository
                .findByEmail(dtoLogin.email())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!passwordEncoder.matches(dtoLogin.senha(), usuario.getSenha())) {
            throw new RuntimeException("Senha inválida");
        }

        return usuario;
    }

    // editar perfil
    @Transactional
    public Usuario editar(Long id, UsuarioEdicaoDTO dtoEdicao) {
        Usuario usuarioLogado = getUsuarioLogado();
        Usuario usuario = usuarioRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        boolean isAdmin = usuarioLogado.getTipoUsuario() == TipoUsuario.ADMINISTRADOR;
        boolean isProprioUsuario = usuarioLogado.getIdUsuario().equals(id);

        if (!isAdmin && !isProprioUsuario) {
            throw new RuntimeException("Acesso negado");
        }

        if (isProprioUsuario) {
            if (dtoEdicao.senhaAtual() == null || dtoEdicao.senhaAtual().isBlank()) {
                throw new RuntimeException("Informe sua senha atual para salvar alterações");
            }

            if (!passwordEncoder.matches(
                    dtoEdicao.senhaAtual(),
                    usuarioLogado.getSenha()
            )) {

                throw new RuntimeException(
                        "Senha atual incorreta"
                );
            }
        }

        usuario.setNomeUsuario(dtoEdicao.nomeUsuario());
        usuario.setTelefone(dtoEdicao.telefone());

        if (!dtoEdicao.email().equalsIgnoreCase(usuario.getEmail())) {
            if (usuarioRepository.existsByEmailAndIdUsuarioNot(dtoEdicao.email(), id)) {
                throw new IllegalArgumentException("Este email já está em uso");
            }
            usuario.setEmail(dtoEdicao.email());
        }

        if (dtoEdicao.novaSenha() != null && !dtoEdicao.novaSenha().isBlank()) {
            if (!dtoEdicao.novaSenha().equals(dtoEdicao.confirmarNovaSenha())) {
                throw new IllegalArgumentException("As senhas não conferem");
            }
            usuario.setSenha(passwordEncoder.encode(dtoEdicao.novaSenha()));
        }
        return usuarioRepository.save(usuario);
    }

    // listar todos os colaboradores
    public List<Usuario> listarTodos() {
        Usuario usuarioLogado = getUsuarioLogado();
        validarAdmin(usuarioLogado);
        return usuarioRepository.findByTipoUsuarioOrderByNomeUsuarioAsc(TipoUsuario.COLABORADOR);
    }

    // buscar
    public List<Usuario> buscarColaboradores(String termo) {
        Usuario usuarioLogado = getUsuarioLogado();
        validarAdmin(usuarioLogado);

        if (termo == null || termo.isBlank()) {
            return usuarioRepository.findByTipoUsuarioOrderByNomeUsuarioAsc(TipoUsuario.COLABORADOR);
        }

        String termoFormatado = termo.trim();

        List<Usuario> porNome =
                usuarioRepository.findByTipoUsuarioAndNomeUsuarioContainingIgnoreCaseOrderByNomeUsuarioAsc(
                        TipoUsuario.COLABORADOR,
                        termoFormatado
                );

        List<Usuario> porEmail =
                usuarioRepository.findByTipoUsuarioAndEmailContainingIgnoreCaseOrderByNomeUsuarioAsc(
                        TipoUsuario.COLABORADOR,
                        termoFormatado
                );

        porEmail.forEach(usuario -> {
            if (!porNome.contains(usuario)) {
                porNome.add(usuario);
            }
        });

        porNome.sort((u1, u2) ->
                u1.getNomeUsuario().compareToIgnoreCase(u2.getNomeUsuario())
        );

        return porNome;
    }

    // excluir
    @Transactional
    public void excluir(Long id) {
        Usuario usuarioLogado = getUsuarioLogado();
        validarAdmin(usuarioLogado);

        if (usuarioLogado.getIdUsuario().equals(id)) {
            throw new RuntimeException("Você não pode excluir sua própria conta");
        }

        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuário não encontrado");
        }
        usuarioRepository.deleteById(id);
    }
}
