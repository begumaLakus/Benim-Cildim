"""Sifre hash'leme — Node tarafindaki `src/utils/password.ts` karsiligi.
Ayni algoritma ve maliyet (bcrypt, 12 tur) kullanildigi icin Express
backend'inin urettigi hash'ler dogrulanabilir durumda kaliyor.
"""

import bcrypt

_SALT_ROUNDS = 12

# bcrypt sifrenin ilk 72 BYTE'ini kullanir. Node'un `bcrypt` paketi fazlasini
# sessizce kirpar, Python'un `bcrypt` paketi ise ValueError firlatir — uzun
# sifre gonderen kullaniciya 500 donmesin diye kirpmayi burada elle yapiyoruz.
_MAX_PASSWORD_BYTES = 72


def _encode(plain_password: str) -> bytes:
    return plain_password.encode("utf-8")[:_MAX_PASSWORD_BYTES]


def hash_password(plain_password: str) -> str:
    return bcrypt.hashpw(_encode(plain_password), bcrypt.gensalt(rounds=_SALT_ROUNDS)).decode()


def verify_password(plain_password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(_encode(plain_password), password_hash.encode("utf-8"))
    except ValueError:
        # Veritabanindaki hash bozuk/bicimsiz — "sifre yanlis" ile ayni sonuc.
        return False
