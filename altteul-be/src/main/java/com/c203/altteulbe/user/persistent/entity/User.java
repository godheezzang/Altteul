package com.c203.altteulbe.user.persistent.entity;

import java.sql.Timestamp;
import java.util.Collection;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;

import com.c203.altteulbe.common.dto.Language;
import com.c203.altteulbe.common.entity.BaseCreatedAndUpdatedEntity;
import com.c203.altteulbe.ranking.persistent.entity.Tier;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * 생성일시, 변경일시를 상속받은 Entity 생성 가능
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "user")
@SuperBuilder(toBuilder = true)
public class User extends BaseCreatedAndUpdatedEntity implements UserDetails, OAuth2User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id", nullable = false, updatable = false)
	private Long userId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "tier_id")
	private Tier tier;

	@Column(name = "profile_img", length = 1024)
	private String profileImg;

	@Column(name = "nickname", length = 50, nullable = false, unique = true)
	private String nickname;

	@Enumerated(EnumType.STRING)
	@Column(name = "main_lang", nullable = false, length = 2)
	private Language mainLang;  // Enum 타입 사용

	@Enumerated(EnumType.STRING)
	@Column(name = "user_status", nullable = false, length = 1)
	private UserStatus userStatus;  // Enum 타입 사용

	@Column(name = "username", length = 50, nullable = false, unique = true)
	private String username;

	@Column(name = "password", length = 128, nullable = true)
	private String password;

	@Enumerated(EnumType.STRING)
	@Column(name = "provider", nullable = false, length = 2)
	private Provider provider;

	@Column(name = "ranking_point", nullable = false)
	private Long rankingPoint;

	@Column(name = "last_out_time")
	private Timestamp lastOutTime;

	@Override
	public String getName() {
		return null;
	}

	public enum UserStatus {
		A, S, D
	}

	public enum Provider {
		LC, GH
	}

	@Override
	public Map<String, Object> getAttributes() {
		return null;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return null;
	}

	@Override
	public String getUsername() {
		return username;
	}

	@Override
	public String getPassword() {
		return password;
	}

	public void hashPassword(PasswordEncoder passwordEncoder) {
		this.password = passwordEncoder.encode(this.password);
	}

	public boolean checkPassword(String plainPassword, PasswordEncoder passwordEncoder) {
		return passwordEncoder.matches(plainPassword, this.password);
	}
}

