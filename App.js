import React, { useState, useEffect } from "react";

const DEMO_USERNAME = "admin";
const DEMO_PASSWORD = "1234";

function App() {
  // Login state
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  // Todo state
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    if (saved)
      return JSON.parse(saved).map((todo) => ({
        ...todo,
        lastDate: new Date(todo.lastDate),
      }));
    return [
      {
        id: 1,
        text: "React öğren",
        done: false,
        lastDate: new Date(new Date().setDate(new Date().getDate() + 4)),
      },
      {
        id: 2,
        text: "Projeyi tamamla",
        done: false,
        lastDate: new Date(new Date().setDate(new Date().getDate() + 10)),
      },
    ];
  });

  const [newTodo, setNewTodo] = useState("");
  const [newDate, setNewDate] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDate, setEditDate] = useState("");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Login işlemi
  const handleLogin = (e) => {
    e.preventDefault();
    if (usernameInput === DEMO_USERNAME && passwordInput === DEMO_PASSWORD) {
      setLoggedIn(true);
      setLoginError("");
      setUsernameInput("");
      setPasswordInput("");
    } else {
      setLoginError("Kullanıcı adı veya şifre hatalı!");
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  // Todo işlemleri
  const handleToggleDone = (id) => {
    if (!loggedIn) {
      alert("Lütfen önce giriş yapınız.");
      return;
    }
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const handleAddTodo = () => {
    if (!loggedIn) {
      alert("Lütfen önce giriş yapınız.");
      return;
    }
    if (!newTodo.trim() || !newDate) {
      alert("Lütfen görev ve tarih giriniz.");
      return;
    }
    const newTodoItem = {
      id: Date.now(),
      text: newTodo.trim(),
      done: false,
      lastDate: new Date(newDate),
    };
    setTodos([...todos, newTodoItem]);
    setNewTodo("");
    setNewDate("");
  };

  const handleDelete = (id) => {
    if (!loggedIn) {
      alert("Lütfen önce giriş yapınız.");
      return;
    }
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleEdit = (todo) => {
    if (!loggedIn) {
      alert("Lütfen önce giriş yapınız.");
      return;
    }
    setEditId(todo.id);
    setEditText(todo.text);
    setEditDate(todo.lastDate.toISOString().slice(0, 10));
  };

  const handleSaveEdit = (id) => {
    if (!editText.trim() || !editDate) {
      alert("Görev ve tarih boş olamaz.");
      return;
    }
    const selectedDate = new Date(editDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      alert("Geçmiş tarih seçilemez.");
      return;
    }
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, text: editText.trim(), lastDate: selectedDate }
          : todo
      )
    );
    setEditId(null);
  };

  const handleCancelEdit = () => {
    setEditId(null);
  };

  // Son 1 hafta kalan yapılmamış todo'lar (uyarılar)
  const warnings = todos.filter((todo) => {
    const now = new Date();
    const oneWeekLater = new Date();
    oneWeekLater.setDate(now.getDate() + 7);
    return !todo.done && todo.lastDate >= now && todo.lastDate <= oneWeekLater;
  });

  return (
    <div
      className={`app-container${!loggedIn ? " locked" : ""}`}
      style={{ maxWidth: 600, margin: "auto", padding: 20 }}
    >
      {!loggedIn ? (
        // Login ekranı
        <div
          className="login-container"
          style={{
            border: "1px solid #ccc",
            padding: 20,
            borderRadius: 8,
            backgroundColor: "#2d2747",
            color: "#d0cde1",
          }}
        >
          <h2>Giriş Yap</h2>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 10 }}>
              <input
                type="text"
                placeholder="Kullanıcı adı"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                style={{ width: "100%", padding: 8, fontSize: 16 }}
                autoFocus
                spellCheck={false}
                autoComplete="username"
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <input
                type="password"
                placeholder="Şifre"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                style={{ width: "100%", padding: 8, fontSize: 16 }}
                autoComplete="current-password"
              />
            </div>
            {loginError && (
              <div style={{ color: "red", marginBottom: 10 }}>{loginError}</div>
            )}
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                fontSize: 16,
                backgroundColor: "#7f5cff",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Giriş Yap
            </button>
          </form>
        </div>
      ) : (
        // Todo uygulaması
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <h1>Todo List</h1>
            <button
              onClick={handleLogout}
              style={{
                padding: "6px 12px",
                backgroundColor: "#7f5cff",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Çıkış Yap
            </button>
          </div>

          <div
            className="add-section"
            style={{ marginBottom: 20, display: "flex", gap: 10 }}
          >
            <input
              type="text"
              placeholder="Yeni görev..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              style={{ flex: 1, padding: 8, fontSize: 16 }}
            />
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              style={{ padding: 8, fontSize: 16 }}
            />
            <button
              onClick={handleAddTodo}
              style={{
                padding: "8px 16px",
                backgroundColor: "#7f5cff",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Ekle
            </button>
          </div>

          <ul className="todo-list" style={{ listStyle: "none", padding: 0 }}>
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={`todo-item ${todo.done ? "done" : ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: 10,
                  borderBottom: "1px solid #ddd",
                  gap: 10,
                  backgroundColor: todo.done ? "#2f2b44" : "#3b3364",
                  borderRadius: 12,
                  boxShadow: "0 4px 12px rgba(17, 12, 47, 0.7)",
                  marginBottom: 18,
                }}
              >
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => handleToggleDone(todo.id)}
                  style={{
                    marginRight: 10,
                    width: 22,
                    height: 22,
                    cursor: "pointer",
                    accentColor: "#9d80ff",
                  }}
                />

                {editId === todo.id ? (
                  <>
                    <input
                      className="edit-text"
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      autoFocus
                      spellCheck={false}
                      style={{
                        flex: 1,
                        padding: 8,
                        fontSize: 16,
                        borderRadius: 6,
                        border: "1px solid #999",
                        backgroundColor: "#1e1837",
                        color: "white",
                      }}
                    />
                    <input
                      className="edit-date"
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      style={{
                        padding: 8,
                        fontSize: 16,
                        borderRadius: 6,
                        border: "1px solid #999",
                        backgroundColor: "#1e1837",
                        color: "white",
                        marginLeft: 10,
                      }}
                    />
                    <button
                      className="save-btn"
                      onClick={() => handleSaveEdit(todo.id)}
                      style={{
                        marginLeft: 10,
                        padding: "6px 14px",
                        backgroundColor: "#8a65ff",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    >
                      Kaydet
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={handleCancelEdit}
                      style={{
                        marginLeft: 10,
                        padding: "6px 14px",
                        backgroundColor: "#444",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    >
                      İptal
                    </button>
                  </>
                ) : (
                  <>
                    <span
                      className="todo-text"
                      style={{
                        flex: 1,
                        color: "white",
                        fontWeight: "600",
                        fontSize: 18,
                        userSelect: "none",
                      }}
                    >
                      {todo.text}
                    </span>
                    <span
                      className="todo-date"
                      style={{
                        color: "#c0bbe3",
                        fontWeight: "600",
                        fontSize: 16,
                        minWidth: 120,
                        textAlign: "center",
                      }}
                    >
                      {todo.lastDate.toLocaleDateString("tr-TR")}
                    </span>
                    <button
                      onClick={() => handleEdit(todo)}
                      className="edit-btn"
                      style={{
                        marginRight: 10,
                        padding: "6px 14px",
                        backgroundColor: "#6e63ff",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="delete-btn"
                      style={{
                        padding: "6px 14px",
                        backgroundColor: "#914d6e",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    >
                      Sil
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>

          {/* Uyarılar */}
          {warnings.length > 0 && (
            <div
              className="warning-box"
              style={{
                border: "2px solid #d1524f",
                backgroundColor: "#6d2d2b",
                padding: 12,
                borderRadius: 10,
                color: "white",
                marginTop: 20,
              }}
            >
              <h3 style={{ marginBottom: 8, color: "#f3d3d1" }}>
                ⚠ Yaklaşan Görevler:
              </h3>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {warnings.map((warn) => (
                  <li key={warn.id}>
                    <strong>{warn.text}</strong> - Son tarih:{" "}
                    {warn.lastDate.toLocaleDateString("tr-TR")}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Giriş yapıldıktan sonra kullanıcı adı gösterimi */}
          <div
            style={{
              marginTop: 30,
              textAlign: "center",
              color: "#b3a7ff",
              fontWeight: "bold",
            }}
          >
            Merhaba, <span style={{ color: "#7f5cff" }}>{DEMO_USERNAME}</span>! ✔
          </div>
        </>
      )}
    </div>
  );
}

export default App;
