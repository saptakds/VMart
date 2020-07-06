package com.tmsl.vmart.config;

import java.util.Properties;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.hibernate5.HibernateTransactionManager;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableTransactionManagement
public class ApplicationContextConfig {

	@Bean
	@Autowired
	public DataSource dataSource() {
		DriverManagerDataSource ds = new DriverManagerDataSource();
		ds.setDriverClassName("com.mysql.jdbc.Driver");
		ds.setUrl("jdbc:mysql://" + SecureConstants.DATABASE_IP + ":" + SecureConstants.DATABASE_PORT + "/"
				+ SecureConstants.DATABASE_NAME + "?verifyServerCertificate=false&useSSL=false&requireSSL=false");
		ds.setUsername(SecureConstants.DATABASE_USERNAME);
		ds.setPassword(SecureConstants.DATABASE_PASSWORD);
		return ds;
	}

	@Bean
	@Autowired
	public LocalSessionFactoryBean sessionFactory() {
		LocalSessionFactoryBean sf = new LocalSessionFactoryBean();
		sf.setDataSource(dataSource());
		sf.setPackagesToScan(new String[] { "com.tmsl.vmart.model", "com.tmsl.vmart.dao" });
		sf.setHibernateProperties(hibernateProperties());
		return sf;
	}

	private Properties hibernateProperties() {
		Properties properties = new Properties();
		properties.put("hibernate.dialect", "org.hibernate.dialect.MySQL8Dialect");
		properties.put("hibernate.show_sql", "true");
		properties.put("hibernate.hbm2ddl.auto", "update");
		properties.put("hibernate.enable_lazy_load_no_trans", "true");
		return properties;
	}

	@Bean
	@Autowired
	public HibernateTransactionManager getTransactionManager() {
		HibernateTransactionManager hbm = new HibernateTransactionManager();
		hbm.setSessionFactory(sessionFactory().getObject());
		return hbm;
	}
}
