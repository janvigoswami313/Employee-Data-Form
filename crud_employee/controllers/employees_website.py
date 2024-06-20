from odoo import http
from odoo.http import request


class EmployeesData(http.Controller):
    @http.route('/employees', type='http', auth='public', website=True)
    def employees_list(self, **kwargs):
        employees_details = request.env['hr.employee'].sudo().search([])

        return request.render('crud_employee.employees_details', {'employees_details': employees_details})

    @http.route('/employee/<model("hr.employee"):employee>', type='http', auth='public', website=True,
                methods=['GET', 'POST'])
    def employee_details(self, employee, **kw):
        if request.httprequest.method == 'POST':
            select_certificate = kw.get('certificate')
            select_marital_status = kw.get('marital')
            select_gender = kw.get('gender')
            select_timezone = kw.get('tz')

            employee.sudo().write({
                'job_id': int(kw.get('job_id')) if kw.get('job_id') else False,
                'address_id': int(kw.get('address_id')) if kw.get('address_id') else False,
                'department_id': int(kw.get('department_id')) if kw.get('department_id') else False,
                'parent_id': int(kw.get('parent_id')) if kw.get('parent_id') else False,
                'coach_id': int(kw.get('coach_id')) if kw.get('coach_id') else False,
                'work_location_id': int(kw.get('work_location_id')) if kw.get('work_location_id') else False,
                'resource_calendar_id': int(kw.get('resource_calendar_id')) if kw.get(
                    'resource_calendar_id') else False,
                'address_home_id': int(kw.get('address_home_id')) if kw.get('address_home_id') else False,
                'bank_account_id': int(kw.get('bank_account_id')) if kw.get('bank_account_id') else False,
                'country_id': int(kw.get('nationality_country_id')) if kw.get('nationality_country_id') else False,
                'country_of_birth': int(kw.get('country_of_birth')) if kw.get('country_of_birth') else False,
                'work_phone': (kw.get('work_phone')),
                'work_email': (kw.get('work_email')),
                'km_home_work': (kw.get('km_home_work')),
                'study_field': (kw.get('study_field')),
                'study_school': (kw.get('study_school')),
                'visa_no': (kw.get('visa_no')),
                'permit_no': (kw.get('permit_no')),
                'visa_expire': (kw.get('visa_expire')),
                'work_permit_expiration_date': (kw.get('work_permit')),
                'has_work_permit': (kw.get('has_work_permit')),
                'children': (kw.get('children')),
                'emergency_contact': (kw.get('emergency_contact')),
                'emergency_phone': (kw.get('emergency_phone')),
                'identification_id': (kw.get('identification_id')),
                'passport_id': (kw.get('passport_id')),
                'birthday': (kw.get('birthday')),
                'place_of_birth': (kw.get('place_of_birth')),
                'certificate': select_certificate,
                'marital': select_marital_status,
                'gender': select_gender,
                'tz': select_timezone,
            })

        job_positions = request.env['hr.job'].sudo().search([])
        department_id = request.env['hr.department'].sudo().search([])
        manager_list = request.env['hr.employee'].sudo().search([])
        coach_list = request.env['hr.employee'].sudo().search([])
        work_address = request.env['res.partner'].sudo().search([])
        work_location = request.env['hr.work.location'].sudo().search([])
        working_hours = request.env['resource.calendar'].sudo().search([])
        related_user = request.env['res.users'].sudo().search([])
        address_home = request.env['res.partner'].sudo().search([])
        account_number = request.env['res.partner.bank'].sudo().search([])
        country_name = request.env['res.country'].sudo().search([])
        birth_country = request.env['res.country'].sudo().search([])
        print('country name', country_name)

        address = employee.address_home_id

        address_details = {
            'home_street': address.street or '',
            'home_street2': address.street2 or '',
            'home_city': address.city or '',
            'home_state_id': address.state_id.name or '',
            'home_zip': address.zip or '',
            'home_country_id': address.country_id.name or '',
        }

        workaddress = employee.address_id

        work_address_details = {
            'work_street': workaddress.street or '',
            'work_street2': workaddress.street2 or '',
            'work_city': workaddress.city or '',
            'work_state_id': workaddress.state_id.name or '',
            'work_zip': workaddress.zip or '',
            'work_country_id': workaddress.country_id.name or '',
        }

        return request.render('crud_employee.employee_form_template', {
            'employee': employee,
            'address_details': address_details,
            'work_address_details': work_address_details,
            'job_positions': job_positions,
            'work_address': work_address,
            'department_id': department_id,
            'manager_list': manager_list,
            'coach_list': coach_list,
            'work_location': work_location,
            'working_hours': working_hours,
            'related_user': related_user,
            'address_home': address_home,
            'account_number': account_number,
            'country_name': country_name,
            'birth_country': birth_country,
        })