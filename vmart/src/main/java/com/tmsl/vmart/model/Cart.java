package com.tmsl.vmart.model;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "Cart")
public class Cart {
	private Long CartId;
	private long cid;
	private List<Product> products = new ArrayList<Product>();

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	public Long getCartId() {
		return CartId;
	}

	public void setCartId(Long cartId) {
		CartId = cartId;
	}

	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}
	
	@ElementCollection(fetch = FetchType.LAZY)
//	 @OneToMany(orphanRemoval=true)
	public List<Product> getProducts() {
		return products;
	}

	public void setProducts(List<Product> products) {
		this.products = products;
	}

}
