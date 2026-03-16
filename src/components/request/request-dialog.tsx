import { Plus } from 'lucide-react'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { useState } from 'react'
import AddRequestForm from './add-request-form'

const RequestDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button ><Plus className="mr-2 h-4 w-4"/>Request Items</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Items</DialogTitle>
          <DialogDescription>
            Request items from another branch
          </DialogDescription>
        </DialogHeader>
        <AddRequestForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  )
}

export default RequestDialog