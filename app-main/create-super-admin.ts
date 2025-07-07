import { supabaseAdmin } from './lib/supabase'

async function createSuperAdmin() {
  try {
    // Créer un domaine super-admin s'il n'existe pas
    const { data: existingDomain } = await supabaseAdmin
      .from('Domain')
      .select('*')
      .eq('name', 'super-admin')
      .single()

    let superAdminDomain = existingDomain

    if (!existingDomain) {
      const { data: newDomain, error: domainError } = await supabaseAdmin
        .from('Domain')
        .insert({
          name: 'super-admin',
          url: 'super-admin',
          isPublish: false,
        })
        .select()
        .single()

      if (domainError) {
        throw domainError
      }
      superAdminDomain = newDomain
    }

    console.log('Domaine super-admin créé:', superAdminDomain)

    // Créer l'utilisateur super admin s'il n'existe pas
    const { data: existingUser } = await supabaseAdmin
      .from('User')
      .select('*')
      .eq('email', 'superadmin@mosalink.com')
      .single()

    let superAdmin = existingUser

    if (existingUser) {
      // Mettre à jour le rôle si l'utilisateur existe
      const { data: updatedUser, error: updateError } = await supabaseAdmin
        .from('User')
        .update({
          role: 'SUPER_ADMIN'
        })
        .eq('email', 'superadmin@mosalink.com')
        .select()
        .single()

      if (updateError) {
        throw updateError
      }
      superAdmin = updatedUser
    } else {
      // Créer l'utilisateur s'il n'existe pas
      const { data: newUser, error: userError } = await supabaseAdmin
        .from('User')
        .insert({
          email: 'superadmin@mosalink.com',
          name: 'Super Administrateur',
          role: 'SUPER_ADMIN',
          domainId: superAdminDomain.id,
        })
        .select()
        .single()

      if (userError) {
        throw userError
      }
      superAdmin = newUser
    }

    console.log('Utilisateur super admin créé:', superAdmin)
    
    // Vérifier tous les domaines existants
    const { data: allDomains, error: domainsError } = await supabaseAdmin
      .from('Domain')
      .select('*')

    if (domainsError) {
      throw domainsError
    }

    console.log('Domaines existants:', allDomains?.length || 0)
    
    // Pour chaque domaine, compter les utilisateurs admin
    for (const domain of allDomains || []) {
      const { data: adminUsers } = await supabaseAdmin
        .from('User')
        .select('id')
        .eq('domainId', domain.id)
        .eq('role', 'ADMIN')
      
      console.log(`- ${domain.name} (${domain.url}) - ${adminUsers?.length || 0} administrateurs`)
    }

  } catch (error) {
    console.error('Erreur lors de la création du super admin:', error)
  }
}

createSuperAdmin()
