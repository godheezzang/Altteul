package com.c203.altteulbe.user.persistent.entity;

import java.sql.Timestamp;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.c203.altteulbe.common.entity.BaseCreatedAndUpdatedEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * 생성일시, 변경일시를 상속받은 Entity 생성 가능
 */
@Entity
@Table(name = "user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class User extends BaseCreatedAndUpdatedEntity implements UserDetails {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id", nullable = false, updatable = false)
	private Long userId;

	@Column(name = "tier_id", nullable = false)
	private Byte tierId;

	@Column(name = "profile_img", length = 1024)
	private String profileImg;

	@Column(name = "nickname", length = 50, nullable = false, unique = true)
	private String nickname;

	@Enumerated(EnumType.STRING)
	@Column(name = "main_lang", nullable = false, length = 2)
	private MainLang mainLang;  // Enum 타입 사용

	@Enumerated(EnumType.STRING)
	@Column(name = "user_status", nullable = false, length = 1)
	private UserStatus userStatus;  // Enum 타입 사용

	@Column(name = "email", length = 50, nullable = false, unique = true)
	private String email;

	@Column(name = "password", length = 128, nullable = false)
	private String password;

	@Enumerated(EnumType.STRING)
	@Column(name = "provider", nullable = false, length = 2)
	private Provider provider;

	@Column(name = "ranking_point", nullable = false)
	private Long rankingPoint;

	@Column(name = "last_out_time")
	private Timestamp lastOutTime;

	public enum MainLang {
		JV, PY
	}

	public enum UserStatus {
		A, S, D
	}

	public enum Provider {
		LC, GH
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return null;
	}

	@Override
	public String getUsername() {
		return email;
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

