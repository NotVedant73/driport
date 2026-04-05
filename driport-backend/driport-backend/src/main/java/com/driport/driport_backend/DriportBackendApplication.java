package com.driport.driport_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class DriportBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(DriportBackendApplication.class, args);
	}

}
