import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function UserDetailsSkeleton() {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="w-full">
          <Skeleton className="h-8 w-2/3 mb-2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Icon and Basic Info */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <div className="mt-2 w-full text-center md:text-left">
            <Skeleton className="h-5 w-20 mb-2" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="w-full text-center md:text-left">
            <Skeleton className="h-5 w-20 mb-2" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>

        {/* User Details */}
        <div className="col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index}>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-full max-w-xs" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <Skeleton className="h-4 w-24" />
      </CardFooter>
    </Card>
  )
} 