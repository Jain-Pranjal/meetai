import React from 'react'
import { Button } from '@/components/ui/button'
function Page() {
  return (
    <div>Page
      <Button className="bg-red-500 hover:bg-red-600">Click Me</Button>
      <Button variant="outline" className="ml-2">Outline Button</Button>
      <Button variant="destructive" className="ml-2">Destructive Button</Button>
      <Button variant="secondary" className="ml-2">Secondary Button</Button>
      <Button variant="ghost" className="ml-2">Ghost Button</Button>
      <Button variant="link" className="ml-2">Link Button</Button>
    </div>
  )
}

export default Page