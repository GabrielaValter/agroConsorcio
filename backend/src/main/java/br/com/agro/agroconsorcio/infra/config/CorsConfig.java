package br.com.agro.agroconsorcio.infra.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {

        return new WebMvcConfigurer() {

            @Override
            public void addCorsMappings(CorsRegistry registry) {

                registry.addMapping("/**")
//                        .allowedOrigins("http://localhost:5173")
//                         acesso pelo celular
                        .allowedOrigins(
                                "http://localhost:5173",
                                "http://localhost:5174",
                                "http://localhost:5175",
                                "http://192.168.100.219:5175",
                                "http://172.20.10.8:5174"
                        )
                        .allowedMethods("*")
                        .allowedHeaders("*");
            }
        };
    }
}