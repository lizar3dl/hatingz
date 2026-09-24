# Implementation Plan: Ratingz Core System

**Branch**: `001-ratingz-core` | **Date**: 2026-09-22 | **Spec**: `.specify/memory/spec.md`

## Summary

Implementação da aplicação web full-stack Ratingz utilizando React + TypeScript no frontend (Enzo), Node.js + Express no backend/BFF (João) e MySQL em container Docker Compose, validada por suíte de testes em Jest (Rick).

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js v24+ (Backend), React 18+ (Frontend)
**Primary Dependencies**: Express, `tsx`, `mysql2`, JWT, Axios, React Router DOM, Vite
**Storage**: MySQL 8.0 instanciado via Docker Compose
**Testing**: Jest / Supertest (Responsável: Rick)
**Target Platform**: Web Browser (Desktop / Mobile Responsive)
**Project Type**: Web Application (Frontend React + Backend REST API/BFF)

## Project Structure

```text
backend/
├── src/
│   ├── config/          # Conexão MySQL e variáveis de ambiente
│   ├── controllers/     # AuthController, MatchController, LineupController, VoteController
│   ├── services/        # Regras de negócio e integração BFF
│   ├── repositories/    # Queries em MySQL (mysql2 pool)
│   ├── middlewares/     # AuthMiddleware (JWT)
│   └── server.ts        # Ponto de entrada do Express (executado via tsx)
└── tests/               # Testes unitários do Rick

frontend/
├── src/
│   ├── components/      # TacticalPitch, MatchCard, Header, LineupCard
│   ├── pages/           # LoginPage, DashboardPage, EscalacaoPage, VotacaoPage, FeedEscalacoesPage
│   ├── services/        # Cliente Axios (api.ts)
│   └── App.tsx          # Configuração do React Router
└── index.html