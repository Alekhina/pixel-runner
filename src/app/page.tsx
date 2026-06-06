"use client";

import Start from '../screens/Start';
import Form from '../screens/Form';
import CharacterMenu from '../screens/CharacterMenu';
import Game from '../screens/Game';
import Completion from '../screens/Completion';
import Victory from '../screens/Victory';
import type { CharacterId } from "@/lib/characters";

import type { Screen } from '../lib/screens';
import { useState } from 'react';

export default function Home() {
  const [screen, setScreen] = useState<Screen>("start");
  const [character, setCharacter] = useState<CharacterId | null>(null);

  return (
    <>
      {(() => {switch (screen) {
        case "start":
          return <Start onClick={() => {setScreen("form")}}></Start>;
        case "form":
          return <Form onClick={() => {setScreen("character")}}></Form>;
        case "character":
          return <CharacterMenu value={character} onChange={setCharacter} onClick={() => {setScreen("game")}}></CharacterMenu>;
        case "game":
          return character ? <Game character={character}></Game> : null;
        case "completion":
          return <Completion></Completion>;
        case "victory":
          return <Victory></Victory>;
        default:
          return null;
        }
      })()}
    </>
  ); 
}
