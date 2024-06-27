/** @odoo-module */

import publicWidget from "@web/legacy/js/public/public_widget";

publicWidget.registry.timeoff_websiteProfile = publicWidget.Widget.extend({
    selector: '#employees_timeoff_data_table,#employees_timeoff_data_form',

    events: {
            'change #holiday_status_id': '_setHideShowField',
            'change #half_day_checkbox': '_setHalfDayCheckbox',
            'change #custom_hours_checkbox': '_setCustomHoursCheckbox',
    },

    start: function () {
        var self = this;
        return this._super.apply(this, arguments).then(function () {
            self._setupRowClick();
            self._setupDateInputs();
            self._setInitialVisibility();
            self._setCustomHoursCheckbox();
        })
    },

    _setupRowClick: function () {
        var self = this;
        this.$('.clickable-row1').on('click', function () {
            var href = $(this).data('href');
            if (href) {
                window.location.href = href;
            }
        });
    },

    _setupDateInputs: function () {
        var self = this;
        var $dateFrom = this.$('#date_from');
        var $dateTo = this.$('#date_to');
        var $duration = this.$('#duration');
        var $hoursDuration = this.$('#hours_duration');
        var $timeFrom = this.$('#custom_hour_from');
        var $timeTo = this.$('#custom_hour_to');

        var setDefaultTimes = function () {
            $timeFrom.val('10');
            $timeTo.val('19');
        };

        var updateDayDuration = function () {
        var date_from = $dateFrom.val();
        var date_to = $dateTo.val();
        if (date_from && date_to) {
            var date_from_obj = new Date(date_from);
            var date_to_obj = new Date(date_to);
            var time_difference = date_to_obj.getTime() - date_from_obj.getTime();
            var day_difference = Math.ceil(time_difference / (1000 * 3600 * 24));
                $duration.val(day_difference + " days");
            } else {
                $duration.val('0.00 days');
            }
        };

        var updateHourDuration = function () {
        var time_from = $timeFrom.val();
        var time_to = $timeTo.val();
        if (time_from && time_to) {
            var hour_difference = time_to - time_from;
            $hoursDuration.val(hour_difference + " hours");
        } else {
            $hoursDuration.val('');
        }
        };

        var today = new Date().toISOString().split('T')[0];
            $dateFrom.val(today);
            $dateTo.val(today);
            setDefaultTimes();

        $dateFrom.add($dateTo).on('change', updateDayDuration);
        $timeFrom.add($timeTo).on('change', updateHourDuration);

        updateDayDuration();
        updateHourDuration();
    },

    _setInitialVisibility: function () {
        var initialSelectedHolidayId = parseInt(this.$('#holiday_status_id').val());
        this._toggleSupportingDocsContainer(initialSelectedHolidayId);
        this._toggleSupportingDate(initialSelectedHolidayId);
    },

    _setHideShowField: function() {
        var self = this;
        var initialSelectedHolidayId = parseInt(this.$('#holiday_status_id').val());
        self._toggleSupportingDocsContainer(initialSelectedHolidayId);
        self._toggleSupportingDate(initialSelectedHolidayId);

        this.$('#holiday_status_id').on('change', function() {
            var selectedHolidayId = parseInt($(this).val());
            self._toggleSupportingDocsContainer(selectedHolidayId);
            self._toggleSupportingDate(selectedHolidayId);
        });

        $('#half_day_checkbox').prop('checked', false);
            self._toggleDateFields(false);

        $('#custom_hours_checkbox').prop('checked', false);
            self._toggleHoursFields(false);
    },

    _toggleSupportingDocsContainer: function(selectedHolidayId) {
        var self = this;
        self._rpc({
            model: 'hr.leave.type',
            method: 'search_read',
            domain: [['id', '=', selectedHolidayId]],
            fields: ['support_document'],
        }).then(function(result) {
            if (result.length > 0) {
                var supportDocumentAllowed = result[0].support_document;
                $('#supporting-docs-container').toggle(!!supportDocumentAllowed);
            } else {
                $('#supporting-docs-container').hide();
            }
        });
    },

    _toggleSupportingDate: function(selectedHolidayId) {
        var self = this;
        self._rpc({
            model: 'hr.leave.type',
            method: 'search_read',
            domain: [['id', '=', selectedHolidayId]],
            fields: ['request_unit'],
        }).then(function(result) {
            if (result.length > 0) {
                var requestUnit = result[0].request_unit;
                if (requestUnit === 'day') {
                    $('#request_unit_date').hide();
                } else {
                    $('#request_unit_date').show();
                }
            } else {
                $('#request_unit_date').hide();
            }
        });
    },

    _setHalfDayCheckbox: function() {
        var self = this;
        this.$('#half_day_checkbox').on('change', function() {
            var isChecked = $(this).is(':checked');

        if (isChecked) {
            self.$('#custom_hours_checkbox').prop('checked', false);
            self._toggleHoursFields(false);
        }
            self._toggleDateFields(isChecked);
        });

        var initialChecked = this.$('#half_day_checkbox').is(':checked');
        var initialHoursChecked = this.$('#custom_hours_checkbox').is(':checked');

        if (initialChecked) {
        this.$('#custom_hours_checkbox').prop('checked', false);
            self._toggleHoursFields(false);
        }
            self._toggleDateFields(initialChecked);

        if (initialChecked) {
            $('#duration').val('4 Hours');
        } else {
            $('#duration').val('');
        }
    },

    _toggleDateFields: function(isChecked) {
        if (isChecked) {
            $('#holiday_dates').hide();
            $('#holiday_date').show();

        var today = new Date().toISOString().slice(0, 10);
            $('#request_date_from').val(today);

        } else {
            $('#holiday_dates').show();
            $('#holiday_date').hide();
        }
    },

    _setCustomHoursCheckbox: function() {
        var self = this;
        this.$('#custom_hours_checkbox').on('change', function() {
            var isHoursChecked = $(this).is(':checked');

        if (isHoursChecked) {
            self.$('#half_day_checkbox').prop('checked', false);
            self._toggleDateFields(false);
        }
           self._toggleHoursFields(isHoursChecked);
        });

        var initialHoursChecked = this.$('#custom_hours_checkbox').is(':checked');
        var initialChecked = this.$('#half_day_checkbox').is(':checked');

        if (initialHoursChecked) {
        this.$('#half_day_checkbox').prop('checked', false);
            self._toggleDateFields(false);
        }
            self._toggleHoursFields(initialHoursChecked);
    },

    _toggleHoursFields: function(isHoursChecked) {
        if (isHoursChecked) {
            $('#holiday_dates').hide();
            $('#custom_hour_date').show();
            $('#custom_hours').show();
            $('#hours_duration_1').show();
            $('#date_duration').hide();

            var today = new Date().toISOString().slice(0, 10);
            $('#request_custom_hour').val(today);

        } else {
            $('#holiday_dates').show();
            $('#custom_hour_date').hide();
            $('#custom_hours').hide();
            $('#hours_duration_1').hide();
            $('#date_duration').show();
        }
    },
});

return publicWidget.registry.websiteProfile;










//<div id="employee_form">
//    <input type="hidden" id="employee_id" value="123"> <!-- Example employee ID -->
//    <div id="timeoff_data" data-url="/employee_timeoff">
//        <button type="button" class="btn btn-info" style="margin-bottom:10px; margin-left:90%;">Timeoff</button>
//    </div>
//</div>


//
//_setupRowClick: function () {
//    var self = this;
//    this.$('#timeoff_data').on('click', function () {
//        var employeeId = $('#employee_id').val(); // Retrieve the employee ID
//        var dataUrl = $(this).data('url');
//
//        if (dataUrl && employeeId) {
//            // Update the URL to include the employee ID as a query parameter
//            dataUrl += '?employee_id=' + employeeId;
//            window.location.href = dataUrl;
//        }
//    });
//}
