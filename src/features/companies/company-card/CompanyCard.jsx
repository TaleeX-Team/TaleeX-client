import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Search, MapPin, Users, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

export default function CompanyCard({ company }) {
  const { name, location, size, industry, id } = company;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded bg-slate-100 flex items-center justify-center text-slate-400">
            TF
          </div>
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-muted-foreground text-sm">{industry}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            {location}
          </div>
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            {size}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-4">
        <Button variant="outline" size="sm">
          Add Job
        </Button>
        <Link to={`/companies/${id}`}>
          <Button variant="default" size="sm">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
