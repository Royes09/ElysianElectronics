import * as React from "react";

export const Plasata = ({ firstName, produse }) => (
  <div>
    <h1>Buna ziua, {firstName}</h1>
    <p>Comanda dumneavoastra a fost plasata.</p>
    <p>
      Timp estimativ de livrare: <strong>3-5 zile lucratoare</strong>
    </p>
    Produsele dumneavoastra:{" "}
    <ul>
      {produse.map((p) => (
        <li>{p}</li>
      ))}
    </ul>
    <p>
      <strong>Va multumim pentru comanda,</strong>
    </p>
    <p>
      <strong>Elysian Electronics</strong>
    </p>
  </div>
);

export const Finalizata = ({ firstName }) => (
  <div>
    <h1>Buna ziua, {firstName}</h1>
    <p>Comanda dumneavoastra a fost finalizata.</p>
    <p>
      <strong>Va multumim pentru comanda,</strong>
    </p>
    <p>
      <strong>Elysian Electronics</strong>
    </p>
  </div>
);
