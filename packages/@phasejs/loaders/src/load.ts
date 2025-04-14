import {
  loadCommands,
  loadCrons,
  loadEvents,
  loadMiddleware,
  loadPrestart,
} from "~/loaders"
import { scanApp } from "~/scan"

import type { BotClient } from "@phasejs/core/client"
import type { AppConfig } from "~/types/app"

async function possiblyLoadPrestart(
  path: string | undefined,
  config: AppConfig,
) {
  if (!path) return undefined
  return await loadPrestart(path, config)
}

async function possiblyLoadMiddleware(
  path: string | undefined,
  config: AppConfig,
) {
  if (!path) return undefined
  return await loadMiddleware(path, config)
}

export async function loadApp(phase: BotClient, config: AppConfig = {}) {
  const paths = await scanApp(config)

  const [prestart, middlewares, commands, crons, events] = await Promise.all([
    possiblyLoadPrestart(paths.prestart, config),
    possiblyLoadMiddleware(paths.middleware, config),
    loadCommands(phase.client, paths.commands, config),
    loadCrons(phase.client, paths.crons, config),
    loadEvents(phase.client, paths.events, config),
  ])

  return {
    prestart,
    middlewares,
    commands,
    crons,
    events,
  }
}
