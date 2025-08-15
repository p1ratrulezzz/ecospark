import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Phone, Mail, MapPin, Loader2, CheckCircle } from "lucide-react";
import type { InsertContact } from "@shared/schema";

export default function ContactForm() {
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    },
  });

  const createContactMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      form.reset();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
      toast({
        title: "Message Sent Successfully!",
        description: "We'll get back to you within 24 hours.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
      console.error("Contact form error:", error);
    },
  });

  const onSubmit = (data: InsertContact) => {
    createContactMutation.mutate(data);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      value: "+1 (555) 123-4567",
      testId: "contact-phone"
    },
    {
      icon: Mail,
      title: "Email Us",
      value: "hello@greentechenergy.com",
      testId: "contact-email"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      value: "123 Clean Energy Blvd, San Francisco, CA",
      testId: "contact-address"
    }
  ];

  return (
    <section id="contact" className="py-20 lg:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6" data-testid="contact-title">
              Let's Power Your Future Together
            </h2>
            <p className="text-xl text-slate-600 mb-8" data-testid="contact-subtitle">
              Ready to explore renewable energy solutions for your business? Get in touch with our experts and discover how we can help you achieve your sustainability goals.
            </p>
            
            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="flex items-center space-x-4" data-testid={info.testId}>
                    <div className="bg-green-primary rounded-lg p-3">
                      <Icon className="text-white text-lg" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{info.title}</div>
                      <div className="text-slate-600">{info.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {showSuccess ? (
              <div className="text-center py-8" data-testid="success-message">
                <CheckCircle className="h-16 w-16 text-green-primary mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-slate-900 mb-2">Message Sent Successfully!</h3>
                <p className="text-slate-600">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="contact-form">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-slate-700">
                            Full Name *
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="John Doe" 
                              {...field} 
                              data-testid="input-name"
                              className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-primary focus:border-green-primary transition-colors duration-200"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-slate-700">
                            Email Address *
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="john@company.com" 
                              {...field} 
                              data-testid="input-email"
                              className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-primary focus:border-green-primary transition-colors duration-200"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-slate-700">
                          Company
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your Company Name" 
                            {...field} 
                            data-testid="input-company"
                            className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-primary focus:border-green-primary transition-colors duration-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-slate-700">
                          Message *
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            rows={5} 
                            placeholder="Tell us about your renewable energy needs..."
                            {...field} 
                            data-testid="input-message"
                            className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-primary focus:border-green-primary transition-colors duration-200 resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    disabled={createContactMutation.isPending}
                    className="w-full bg-green-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-600 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    data-testid="button-submit"
                  >
                    {createContactMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
