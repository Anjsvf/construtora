import React from 'react';
import { Award, Users, Building2, Briefcase } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Sobre Nossa Empresa
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Há mais de 20 anos construindo o futuro com qualidade e inovação
          </p>
        </div>

        {/* Company Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {[
            { number: "20+", label: "Anos de Experiência", icon: Building2 },
            { number: "500+", label: "Projetos Concluídos", icon: Briefcase },
            { number: "300+", label: "Colaboradores", icon: Users },
            { number: "50+", label: "Prêmios", icon: Award }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                {React.createElement(stat.icon, { className: "w-8 h-8 text-blue-600" })}
              </div>
              <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission and Values */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nossa Missão</h2>
            <p className="text-gray-600">
              Construir com excelência, inovação e sustentabilidade, contribuindo para o 
              desenvolvimento urbano e proporcionando qualidade de vida às pessoas através 
              de nossas obras.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nossos Valores</h2>
            <ul className="space-y-3 text-gray-600">
              <li>• Qualidade e excelência em cada detalhe</li>
              <li>• Compromisso com prazos e orçamentos</li>
              <li>• Sustentabilidade e responsabilidade ambiental</li>
              <li>• Inovação e tecnologia em nossos processos</li>
              <li>• Valorização e desenvolvimento de nossa equipe</li>
            </ul>
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Nossa Equipe</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Roberto Silva",
                role: "Diretor Executivo",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80"
              },
              {
                name: "Ana Santos",
                role: "Diretora de Projetos",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80"
              },
              {
                name: "Carlos Mendes",
                role: "Diretor de Operações",
                image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80"
              }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}