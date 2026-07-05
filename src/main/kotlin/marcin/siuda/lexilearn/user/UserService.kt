package marcin.siuda.lexilearn.user

import marcin.siuda.lexilearn.config.JwtTokenProvider
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtTokenProvider: JwtTokenProvider,
    private val authenticationManager: AuthenticationManager,
) {

    @Transactional
    fun register(request: RegisterRequest): AuthResponse {
        if (userRepository.existsByUsername(request.username)) {
            throw IllegalArgumentException("Username already taken")
        }

        val user = User(
            username = request.username,
            password = passwordEncoder.encode(request.password),
        )

        userRepository.save(user)
        val token = jwtTokenProvider.generateToken(user.username)
        return AuthResponse(
            token = token,
            username = user.username,
            expiresIn = jwtTokenProvider.expirationMs,
        )
    }

    fun login(request: LoginRequest): AuthResponse {
        authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(request.username, request.password)
        )

        val user = userRepository.findByUsername(request.username)
            ?: throw UsernameNotFoundException("User not found")

        val token = jwtTokenProvider.generateToken(user.username)
        return AuthResponse(
            token = token,
            username = user.username,
            expiresIn = jwtTokenProvider.expirationMs,
        )
    }
}
