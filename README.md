# BigBack-Lies

Backend dla aplikacji [Lies](https://github.com/gostekk/lies).

## Modele
### Recap
*Model zawierający podsumowanie sesji gry.*

| Nazwa | Typ | Wymagany | Opis |
|---------|--------|-----------|-----|
| Title | String | Tak | Tytuł |
| Description | String | Tak | Opis sesji |
| sessionDate | Date | Tak | Data sesji |
| createdAt | Date | Default value | Data dodania |

## Trasy
|Ścieżka           |Zapytanie|Opis                         |
|------------------|---------|-----------------------------|
|/api/lies/test    | GET     | Trasa testowa.              |
|/api/lies/        | GET     | Trasa zwraca wszystkie podsumowania znajdujące się w bazie danych. |
|/api/lies/:id     | GET     | Pobranie informacji z bazy danych na temat wybranego podsumowania. |
|/api/lies/        | POST    | Dodanie nowego podsumowania do bazy danych. |
|/api/lies/edit/:id| POST    | Edycja wybranego podsumowania.        |
|/api/lies/delete  | POST    | Usunięcie podsumowania.        |

## Walidacja
### Recap
- **Tytuł** (title)
1. Element jest wymagany.
2. Tytuł może zawierać maksymalnie 150 znaków.
- **Opis sesji** (description)
 1. Element jest wymagany.
 2. Opis musi zawierać co namniej 50 znaków.
 - **Data sesji** (sessionDate)
 1. Element jest wymagany.

<br></br>

**Created by**  [Grzegorz Jaworski](https://github.com/gostekk)