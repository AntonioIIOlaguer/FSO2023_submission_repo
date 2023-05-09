```mermaid
sequenceDiagram
    participant browser
    participant server

    Note over browser: User creates new note
    Note over browser: Rerenders the note list with the new note
    browser->>server: POST https://https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    Note right of browser: Sends note as JSON string
    activate server
    Note over server: Adds the new note to DB
    deactivate server

```
