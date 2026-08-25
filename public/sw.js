self.addEventListener('push', (event) => {
  const dados = event.data ? event.data.json() : {}
  const titulo = dados.titulo || 'FlowDaily'
  event.waitUntil(
    self.registration.showNotification(titulo, {
      body: dados.corpo || '',
      icon: '/favicon.svg',
      data: { url: dados.url || '/app' },
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/app'
  event.waitUntil(clients.openWindow(url))
})
