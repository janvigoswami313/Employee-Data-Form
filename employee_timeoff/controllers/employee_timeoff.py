from odoo import http
from odoo.http import request
from datetime import datetime


class EmployeesTimeoffData(http.Controller):
    @http.route('/employee_timeoff', type='http', auth='user', website=True)
    def employee_timeoff(self):
        # current_user = request.env.user
        # print("Current User++++++++++++++++++++++++++++++++++++++++++=: ", current_user)

        employee_id = request.env['hr.leave'].sudo().search([])
        print('leave id',employee_id)

        employee_ids = []
        for leave in employee_id:
            employee_ids.append(leave.employee_id.id)
        print('employee id who took leave ',employee_ids)

        # ('employee_id.user_id', '=', current_user.id)

        employees_timeoff_data = request.env['hr.leave'].sudo().search([])
        # print("+===================================+",employees_timeoff_data)

        return request.render('employee_timeoff.employees_timeoff_data', {
            'employee_id': employee_id,
            'employee_ids': employee_ids,
            'employees_timeoff_data': employees_timeoff_data
        })


    @http.route('/timeoff/<model("hr.leave"):timeoff>', type='http', auth='user', website=True,
                methods=['GET', 'POST'])
    def employee_details(self, timeoff, **post):
        print('post>>>>>>>>>>>>>>>>>>>>>>>>>>',post)
        holiday_off = request.env['hr.leave.type'].sudo().search([])

        if request.httprequest.method == 'POST':
            timeoff_id = post.get('timeoff_id')
            timeoff = request.env['hr.leave'].browse(int(timeoff_id))

            date_from = datetime.strptime(post['date_from'], '%Y-%m-%d')
            date_to = datetime.strptime(post['date_to'], '%Y-%m-%d')
            duration = (date_to - date_from).days + 1


        return request.render('employee_timeoff.employee_timeoff_data_form', {
            'timeoff': timeoff,
            'holiday_off': holiday_off,
        })
